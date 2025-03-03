import { ActionFunction } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import { Button, Card, Page, TextField } from "@shopify/polaris";
import { useState } from "react";
import { Form, useActionData, useSubmit } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  console.log("email", email);
  console.log("name", name);
  try {
    const response = await admin.graphql(
      `#graphql
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      userErrors {
        field
        message
      }
      customer {
        id
        email
        taxExempt
        firstName
        lastName
        amountSpent {
          amount
          currencyCode
        }
        smsMarketingConsent {
          marketingState
          marketingOptInLevel
          consentUpdatedAt
        }
      }
    }
  }`,
      {
        variables: {
          input: {
            email: email,
            // phone: "+84819130699",
            firstName: name,
            smsMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN",
            },
          },
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("data", data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return null;
  } catch (err) {
    console.log("err", err);
    return new Response("error", { status: 500 });
  }
};

const AppCustomers = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  console.log(actionData, "actionData");

  const generateCustomer = () => submit({}, { replace: true, method: "POST" });

  return (
    <Page>
      <Card>
        <Form onSubmit={generateCustomer} method="post">
          <TextField
            id="name"
            name="name"
            label="name"
            autoComplete="off"
            value={name}
            onChange={(value) => setName(value)}
          />
          <TextField
            id="email"
            name="email"
            label="email"
            autoComplete="off"
            value={email}
            onChange={(value) => setEmail(value)}
          />
          <Button submit>create customer</Button>
        </Form>
      </Card>
    </Page>
  );
};

export default AppCustomers;
