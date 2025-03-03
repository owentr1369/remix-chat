import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate, apiVersion } from "app/shopify.server";
import { Card, Layout, List, Page } from "@shopify/polaris";

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;
  try {
    const response = await fetch(
      `https://${shop}/admin/api/${apiVersion}/products.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken || "",
        },
      },
    );
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

const AppProducts = () => {
  const products = useLoaderData() as any[];
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <List type="bullet" gap="loose">
              {products?.map((product: any) => {
                return (
                  <List.Item key={product.id}>
                    <h2>{product.title}</h2>
                    <h2>{product.description}</h2>
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

export default AppProducts;
