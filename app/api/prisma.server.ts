export const createCustomer = async ({ email, name }: any) => {
  return await prisma.customer.create({
    data: {
      email,
      name,
      id: "12345",
    },
  });
};
