import type { LoaderFunction } from "@remix-run/node";
import { Card, Layout, Page } from "@shopify/polaris";
import { authenticate, apiVersion } from "app/shopify.server";

export const query = `{
  collections(first)
}`;

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;

  try {
    const response = await fetch(
      `https://${shop}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: query,
      },
    );
    if (response.ok) {
      const data = await response.json();
      const {
        data: {
          collections: { edges },
        },
      } = data;
      return edges;
    }
  } catch (err) {
    console.error(err);
  }
};

const Collections = () => {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>Collections</Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Collections;
