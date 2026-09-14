import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserContext";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

export default function User() {
  const { user } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const getUsers = async () => {
    try {
      const result = await fetch(`${API_URL}/api/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          "x-user-id": user?._id,
        },
      });

      if (result.ok) {
        const data = await result.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Get users error:", error);
      setMessage("Failed to load users.");
      setMessageType("error");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      getUsers();
    }
  }, [user]);

  const openPasswordDialog = (selectedUser) => {
    setSelectedUser(selectedUser);
    setPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  const closePasswordDialog = () => {
    setSelectedUser(null);
    setPassword("");
    setConfirmPassword("");
  };

  const changePassword = async () => {
    setMessage("");

    if (!password || !confirmPassword) {
      setMessage("Please enter both password fields.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      const result = await fetch(`${API_URL}/api/user`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?._id,
        },
        body: JSON.stringify({
          id: selectedUser._id,
          password: password,
        }),
      });

      const data = await result.json();

      if (result.ok) {
        setMessage("Password changed successfully.");
        setMessageType("success");

        closePasswordDialog();
      } else {
        setMessage(data.message || "Failed to change password.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Change password error:", error);

      setMessage("Failed to change password.");
      setMessageType("error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>

      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mb: 0.5 }}
        >
          User Management
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Manage user accounts and passwords.
        </Typography>
      </Box>

      {/* Success / Error Message */}
      {message && (
        <Alert
          severity={messageType}
          sx={{ mb: 2 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {/* User Table */}
      <Card
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>

          {users.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography color="text.secondary">
                No users found.
              </Typography>
            </Box>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f5f7fa",
                    textAlign: "left",
                  }}
                >
                  <th style={headerStyle}>Username</th>
                  <th style={headerStyle}>Email</th>
                  <th style={headerStyle}>Name</th>
                  <th style={headerStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => (
                  <tr key={item._id}>

                    <td style={cellStyle}>
                      <Typography fontWeight={500}>
                        {item.username}
                      </Typography>
                    </td>

                    <td style={cellStyle}>
                      <Typography color="text.secondary">
                        {item.email}
                      </Typography>
                    </td>

                    <td style={cellStyle}>
                      {item.firstname} {item.lastname}
                    </td>

                    <td style={cellStyle}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openPasswordDialog(item)}
                      >
                        Change Password
                      </Button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog
        open={Boolean(selectedUser)}
        onClose={closePasswordDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Change Password
        </DialogTitle>

        <DialogContent>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Change the password for{" "}
            <strong>{selectedUser?.username}</strong>.
          </Typography>

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

        </DialogContent>

        <DialogActions sx={{ p: 2 }}>

          <Button
            onClick={closePasswordDialog}
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={changePassword}
          >
            Change Password
          </Button>

        </DialogActions>
      </Dialog>

    </Box>
  );
}

const headerStyle = {
  padding: "14px 16px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#444",
  borderBottom: "1px solid #e0e0e0",
};

const cellStyle = {
  padding: "14px 16px",
  fontSize: "14px",
  borderBottom: "1px solid #eeeeee",
};