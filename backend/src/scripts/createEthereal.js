import nodemailer from "nodemailer";

async function main() {
    const testAccount = await nodemailer.createTestAccount();

    console.log("User: ", testAccount.user);
    console.log("Pass: ", testAccount.pass);
    console.log("Url: ", testAccount.web);
}

main();