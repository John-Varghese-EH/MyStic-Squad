# MyStic-Squad
New Project team

## Technology Stack

This project is built with a modern, robust, and scalable technology stack:

- **Frontend Framework**: [Next.js](https://nextjs.org/) (with React and TypeScript) - For server-side rendering, static site generation, and a seamless developer experience.
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/) - A collection of beautifully designed, accessible, and composable components.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) - Google's open-source framework for building production-ready AI-powered features, used here for all generative AI flows.
- **Database**: [Firestore](https://firebase.google.com/docs/firestore) - A flexible, scalable NoSQL cloud database used for the real-time chat demonstration.
- **Hosting**: Deployed on serverless platforms like [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) and Netlify for global scale and reliability.

## Encryption Model

The application demonstrates end-to-end encryption using the **AES (Advanced Encryption Standard)** algorithm. This is a form of **symmetric encryption**, which means the same secret key is used to both encrypt (lock) and decrypt (unlock) data.

Here’s how it works in the Chat Demo:
1.  **Encryption on the Client**: Before a message is sent from the user's browser, it is encrypted using the shared secret key with the `crypto-js` library.
2.  **Transmission of Ciphertext**: Only the encrypted, unreadable text (ciphertext) is sent over the network and stored in the database. The server and database never have access to the plaintext message.
3.  **Decryption on the Client**: When another user receives the message, their client uses the same shared secret key to decrypt the ciphertext back into readable plaintext.

This model ensures that the conversation remains private and secure, as the plaintext messages never leave the devices of the participating users. The **Encryption Demo** page provides a live, hands-on demonstration of this process.
