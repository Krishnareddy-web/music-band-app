"use server";

export async function submitContactForm(formData: FormData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Simulate database save or email sending
    console.log('Form Submission:', { name, email, message });

    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success
    return { success: true, message: 'Message sent successfully! We will get back to you soon.' };
}
