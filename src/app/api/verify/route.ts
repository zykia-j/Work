import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPlan } from "@/lib/planCache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  const planId = searchParams.get("planId");

  if (!planId) {
    return NextResponse.json({ error: "Missing planId" }, { status: 400 });
  }

  // In dev/demo mode without Stripe, return the plan directly
  if (!process.env.STRIPE_SECRET_KEY || !sessionId) {
    const plan = getPlan(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found or expired" }, { status: 404 });
    }
    return NextResponse.json({ plan, paid: true });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const plan = getPlan(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found or expired" }, { status: 404 });
    }

    return NextResponse.json({ plan, paid: true });
  } catch (err) {
    console.error("[verify]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
