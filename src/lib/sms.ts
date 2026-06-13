import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const sendSMS = async (to: string, body: string) => {
    if (!client || !fromPhone) {
        console.warn("\n!!! [SMS WARNING] !!!\nTwilio is not configured. Falling back to console log.");
        console.log(`\n--- [VIRTUAL SMS] ---\nTO: ${to}\nBODY: ${body}\n---------------------\n`);
        return { success: true, virtual: true };
    }

    try {
        await client.messages.create({
            body,
            from: fromPhone,
            to
        });
        return { success: true };
    } catch (error: any) {
        console.error("Twilio SMS send error:", error);
        return { success: false, error: error.message };
    }
};
