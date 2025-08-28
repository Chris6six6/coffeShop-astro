import { nullToEmptyString } from "@/helpers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const contact = {
    sendEmail: defineAction({
        accept: 'form',
        input: z.object({
            name: z.preprocess(
                nullToEmptyString,
                z.string().min(1, { message: "Name is required" }),
            ),
            email: z.preprocess(
                nullToEmptyString,
                z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
            ),
            subject: z.preprocess(
                nullToEmptyString,
                z.string().min(1, { message: "Subject is required" }),
            ),
            message: z.preprocess(
                nullToEmptyString,
                z.string().min(1, { message: "Message is required" }),
            ),
        }),
        handler: async (input) => {
            const url = `${import.meta.env.HOME_URL}/wp-json/contact-form-7/v1/contact-forms/138/feedback`;

            const formData = new FormData();
            formData.append('your-name', input.name);
            formData.append('your-email', input.email);
            formData.append('your-subject', input.subject);
            formData.append('your-message', input.message);
            formData.append('_wpcf7_unit_tag', 'wpcf7-f138');

            const res = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            await res.json();

            console.log(url);
            console.log(res);
            
            return {
                error: false,
                message: "Message sent successfully"
            }
        }
    })
}