// src/app/api/item/[item_id]/route.js

import corsHeaders from "../../../../lib/cors";
import { getClientPromise } from "../../../../lib/mongodb";
import { verifyJWT } from "../../../../lib/auth";
import {
  errorResponse,
  printExceptionLog,
  successResponse,
} from "../../../../lib/utils";
import { ObjectId } from "mongodb";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

async function createAuditLog(user, action, details = {}) {
  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);

    await db.collection("auditLog").insertOne({
      userId: user.id,
      username: user.username,
      email: user.email,
      action: action,
      resource: "item",
      details: details,
      timestamp: new Date(),
    });
  } catch (error) {
    printExceptionLog("Audit Log", error);
  }
}

export async function GET(request, { params }) {
  // Check authentication
  const user = verifyJWT(request);

  if (!user) {
    return errorResponse("Unauthorized Request", 401);
  }

  const { item_id } = await params;

  try {
    const client = await getClientPromise();

    const db = client.db(process.env.DB_NAME);

    const item = await db
      .collection("item")
      .findOne({ _id: new ObjectId(item_id) });

    if (item) {
      // Record audit log
      await createAuditLog(user, "GET_ITEM", {
        itemId: item_id,
      });

      return successResponse(
        {
          item,
        },
        201,
      );
    } else {
      return errorResponse("Item not found", 404);
    }
  } catch (error) {
    printExceptionLog("GET Item Exception", error);

    return errorResponse("GET Item Internal Error", 500);
  }
}

export async function DELETE(request, { params }) {
  // Check authentication
  const user = verifyJWT(request);

  if (!user) {
    return errorResponse("Unauthorized Request", 401);
  }

  const { item_id } = await params;

  try {
    const client = await getClientPromise();

    const db = client.db(process.env.DB_NAME);

    const deleteResult = await db
      .collection("item")
      .updateOne(
        { _id: new ObjectId(item_id) },
        { $set: { status: "DELETED" } }
      );

    if (deleteResult.matchedCount === 0) {
      return errorResponse("Item not found", 404);
    }

    // Record audit log
    await createAuditLog(user, "DELETE_ITEM", {
      itemId: item_id,
    });

    return successResponse(
      { message: "Delete Success" },
      200
    );
  } catch (error) {
    printExceptionLog("DELETE Item Exception", error);

    return errorResponse("DELETE Item Internal Error", 500);
  }
}

export async function PUT(request, { params }) {
  // Check authentication
  const user = verifyJWT(request);

  if (!user) {
    return errorResponse("Unauthorized Request", 401);
  }

  const { item_id } = await params;

  console.log("==>item id: ", item_id);

  try {
    const data = await request.json();

    const client = await getClientPromise();

    const db = client.db(process.env.DB_NAME);

    const storedItem = await db
      .collection("item")
      .findOne({ _id: new ObjectId(item_id) });

    if (storedItem) {
      storedItem.name = data.name;
      storedItem.price = data.price;
      storedItem.amount = data.amount;
      storedItem.category = data.category;

      console.log(storedItem);

      const updatedResult = await db
        .collection("item")
        .updateOne(
          { _id: new ObjectId(item_id) },
          { $set: storedItem }
        );

      console.log("==>update result: ", updatedResult);

      const updateOk = Number(updatedResult.modifiedCount) > 0;

      if (updateOk) {
        // Record audit log
        await createAuditLog(user, "UPDATE_ITEM", {
          itemId: item_id,
          name: data.name,
          category: data.category,
          price: data.price,
          amount: data.amount,
        });

        return successResponse(
          { message: "Item update success" },
          201
        );
      } else {
        return errorResponse(
          { message: "Item update failed" },
          400
        );
      }
    } else {
      return errorResponse(
        { message: "Item not found" },
        400
      );
    }
  } catch (error) {
    printExceptionLog("PUT Item Exception", error);

    return errorResponse("PUT Item Internal Error", 500);
  }
}