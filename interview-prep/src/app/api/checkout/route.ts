import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const { planId } = (await req.json()) as { planId: string };

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 1500,
          product_data: {
            name: "7-Day Interview Success Pack",
            description:
              "Personalized LeetCode study plan + gap analysis tailored to your target role",
            images: [],
          },
        },
        quantity: 1,
      },
    ],
    metadata: { planId },
    success_url: `${appUrl}/results?session_id={CHECKOUT_SESSION_ID}&planId=${planId}`,
    cancel_url: `${appUrl}/?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
