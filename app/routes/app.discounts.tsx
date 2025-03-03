import { ActionFunction } from "@remix-run/node";
import { useActionData, useSubmit, Form } from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import { Button, Card, Page, TextField } from "@shopify/polaris";
import { useState } from "react";

export const action: ActionFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  try {
    const formData = await request.formData();
    const title = formData.get("discountTitle") as string;
    const startsAt = "2025-01-01T00:00:00Z";
    const endsAt = "2025-12-31T23:59:59Z";
    const code = "10FORYOU";
    const minimumRequirementSubtotal = 2;
    const discountAmount = 3;
    const response = await admin.graphql(
      `#graphql
    mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode {
      id
      codeDiscount {
        ... on DiscountCodeBasic {
        title
        startsAt
        endsAt
        customerSelection {
          ... on DiscountCustomers {
          all
          }
        }
        customerGets {
          value {
          ... on DiscountPercentage {
            percentage
          }
          }
        }
        }
      }
      }
      userErrors {
      field
      message
      }
    }
    }`,
      {
        variables: {
          basicCodeDiscount: {
            title,
            code,
            startsAt,
            endsAt,
            customerSelection: {
              all: true,
            },
            customerGets: {
              value: {
                percentage: 0.1,
              },
              items: {
                all: true,
              },
            },
            minimumRequirement: {
              subtotal: {
                greaterThanOrEqualToSubtotal: minimumRequirementSubtotal,
              },
            },
            usageLimit: 100,
            appliesOncePerCustomer: true,
          },
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      console.log("Created discount");
      return new Response(JSON.stringify(data), { status: 200 });
    }
    return null;
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
const AppDiscount = () => {
  const [discountTitle, setDiscountTitle] = useState("");

  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  console.log(actionData, "actionData");
  const generateDiscount = () => submit({}, { replace: true, method: "POST" });

  return (
    <Page>
      <Card>
        <Form onSubmit={generateDiscount} method="post">
          <TextField
            id="discountTitle"
            name="discountTitle"
            label="title"
            autoComplete="off"
            value={discountTitle}
            onChange={(value) => setDiscountTitle(value)}
          />
          <Button submit>create Discount</Button>
        </Form>
      </Card>
    </Page>
  );
};

export default AppDiscount;
