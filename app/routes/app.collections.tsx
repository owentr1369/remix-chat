import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, List, Page } from "@shopify/polaris";
// import { apiVersion, authenticate } from "./shopify.server";
import { apiVersion, authenticate } from "app/shopify.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;

  const response = await fetch(
    `https://${shop}/admin/api/${apiVersion}/custom_collections.json`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    },
  )
    .then((response) => response.json())
    .then((json) => json.custom_collections);
  return response;
};

const Collections = () => {
  const collections: any = useLoaderData();
  console.log(collections, "collections");

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <h1>hello world</h1>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <List type="bullet" gap="loose">
              {collections?.map((collection: any) => {
                return (
                  <List.Item key={collection.id}>
                    <h2>{collection.title}</h2>
                    <h2>{collection.description}</h2>
                  </List.Item>
                );
              })}
            </List>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Collections;
