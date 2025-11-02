import Mailgen from "mailgen";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const getZohoAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      new URLSearchParams({
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Failed to refresh Zoho token:",
      error.response?.data || error.message
    );
    throw new Error("Zoho token refresh failed");
  }
};

const sendEmail = async (options) => {
  try {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Madhan Kumar Gali",
        link: "https://madhankumarg.com",
      },
    });

    const emailTextual = mailGenerator.generatePlaintext(
      options.mailgenContent
    );
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    const accessToken = await getZohoAccessToken();

    const url = `${process.env.ZOHO_API_DOMAIN}/mail/v1/accounts/${process.env.ZOHO_ACCOUNT_ID}/messages`;

    const mailData = {
      fromAddress: process.env.ZOHO_FROM_EMAIL,
      toAddress: "gmadhan99@gmail.com",
      subject: options.subject,
      content: emailHtml,
      contentType: "html",
    };

    const response = await axios.post(url, mailData, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log(`Email successfully sent to ${options.email}`);
    return response.data;
  } catch (error) {
    console.error("❌ Email service failed:");
    console.error(error.response?.data || error.message);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => ({
  body: {
    name: username,
    intro: "Welcome to our app! We're excited to have you on board.",
    action: {
      instructions: "To verify your email, please click the button below:",
      button: {
        color: "#22BC66",
        text: "Verify your email",
        link: verificationUrl,
      },
    },
    outro:
      "Need help or have questions? Just reply to this email — we'd love to help.",
  },
});

const forgotPasswordMailgenContent = (username, passwordResetUrl) => ({
  body: {
    name: username,
    intro: "We received a request to reset your account password.",
    action: {
      instructions: "Click the button below to reset your password:",
      button: {
        color: "#FF0000",
        text: "Reset Password",
        link: passwordResetUrl,
      },
    },
    outro:
      "If you didn’t request this, no action is needed. Your account remains secure.",
  },
});

export {
  forgotPasswordMailgenContent,
  emailVerificationMailgenContent,
  sendEmail,
};
