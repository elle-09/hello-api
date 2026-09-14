// src/app/api/item/route.js

import { getClientPromise } from "../../../lib/mongodb";
import { verifyJWT } from "../../../lib/auth";
import { errorResponse, printExceptionLog, successResponse } from "../../../lib/utils";

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

export async function GET(request) {
  // Check authentication
  const user = verifyJWT(request);

  if (!user) {
    return errorResponse("Unauthorized Request", 401);
  }
  try {
    const client = await getClientPromise();

    const db = client.db(process.env.DB_NAME);

    const itemList = await db.collection("item").find({ status: "ACTIVE" }).toArray();

    // Record GET action
    await createAuditLog(user, "GET_ITEMS", {
      count: itemList.length,
    });

    return successResponse({ itemList }, 201);
  } catch (error) {
    printExceptionLog("GET Items", error);

    return errorResponse("GET Item Internal Error", 500);
  }
}

export async function POST(request) {
  // Check authentication
  const user = verifyJWT(request);

  if (!user) {
    return errorResponse("Unauthorized Request", 401);
  }

  try {
    const data = await request.json();

    const name = data.name;

    const category = data.category;

    const price = data.price;

    const amount = data.amount;

    const client = await getClientPromise();

    const db = client.db(process.env.DB_NAME);

    const insertResult = await db.collection("item").insertOne({
      name: name,

      category: category,

      price: price,

      amount: amount,

      status: "ACTIVE",
    });

    // Record POST action
    await createAuditLog(user, "CREATE_ITEM", {
      itemId: insertResult.insertedId,
      name: name,
      category: category,
      price: price,
      amount: amount,
    });

    
    return successResponse(
      {
        id: insertResult.insertedId,
      },
      201,
    );
  } catch (error) {
    printExceptionLog("POST Items", error);
    return errorResponse("POST Item Internal Error", 500);
  }
}
