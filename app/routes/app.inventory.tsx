import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate, apiVersion } from "app/shopify.server";
import { Card, Layout, List, Page } from "@shopify/polaris";

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  try {
    const response = await fetch(
      `https://${session.shop}/admin/api/${apiVersion}/inventory_levels.json?location_id=69259657334`,
      {
        headers: {
          "X-Shopify-Access-Token": session.accessToken || "",
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

const AppInventory = () => {
  const inventoryLevels = useLoaderData() as any[];
  console.log(inventoryLevels, "inventoryLevels");
  return <div>AppInventory</div>;
};

export default AppInventory;
