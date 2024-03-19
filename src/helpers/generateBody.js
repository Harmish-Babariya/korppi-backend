module.exports = async (id, serviceName, companyName, title, price, offer, features, benefits, userName, role, email, website) => {
    // const featureList = features.map(feature => `<li>${feature}</li>`).join('');
    // const benefitList = benefits.map(benefit => `<li>${benefit}</li>`).join('');
    // return `<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>body {font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f4f4f4;}.container {max-width: 600px;margin: 20px auto;padding: 20px;background-color: #ffffff;border-radius: 5px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}h1,h2,p {margin: 0;}.offer-details {margin-top: 20px;padding: 20px;background-color: #f9f9f9;border-radius: 5px;}.feature-list,.benefit-list {margin-top: 10px;padding-left: 20px;}.signature {margin-top: 20px;padding-top: 20px;border-top: 1px solid #ccc;}</style></head><body><img src='${process.env.API_URL}/email/open/${id}' width='1' height='1' style='display: none;' alt=''/><div class='container'><h1>${serviceName} Offer from ${companyName}</h1><div class='offer-details'><h2>Offer Details</h2><p>Title: ${title}</p><p>Price: ${price}</p><p>Offer: ${offer}</p><h3>Features:</h3><ul class='feature-list'>${featureList}</ul><h3>Benefits:</h3><ul class='benefit-list'>${benefitList}</ul></div><div class='signature'><p>${userName}</p><p>${role} | ${companyName}</p><p>E: <a href='mailto:${email}'>${email}</a></p><p>W: <a href='${website}'>${website}</a></p></div></div></body></html>`


    const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Create a email for service ${serviceName}.  These are features ${features.join(
              ","
            )}. These are benefits ${benefits.join(
              ","
            )}. Price: ${price}. Discount: ${offer}Off. recipient name is ${recipientName}.  recipient company is ${recipientCompany}. sender's name is ${userName}. sender's company is ${companyName}. sender's company website is ${website}. sender's email is ${email}. sender's role in company is ${role}. use this details only. Create email message not template. remove subject part.`,
          },
        ],
        model: "gpt-4-1106-preview",
        max_tokens: 500,
        temperature: 1,
      });

      return chatCompletion
}