const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("local"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

const listId = "9b46e61849";

mailchimp.setConfig({
  apiKey: "cb27f9d4eb202919bf66e50151f98c84-us6",
  server: "us6",
});

app.post("/", (req, res) => {
  // console.log(req.body);
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const emailAddress = req.body.email;
  // console.log(firstName, lastName, emailAddress);
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
  };
  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });
      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );
      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
});
app.post("/failure.html", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`App is listening at port: http://localhost:${port}`);
});

// cb27f9d4eb202919bf66e50151f98c84-us6
// 9b46e61849
