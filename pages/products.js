import { getServerSession } from "next-auth";
import Center from  "../components/Center";
import Header from "../components/Header";
import ProductsGrid from "../components/ProductsGrid";
import Title from "../components/Title";
import { mongooseConnect } from "../lib/mongoose";
import { Product } from "../models/product";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "../models/WishedProduct";


// import getServerSession from "delta/lib/session";

export default function ProductsPage({products, wishedProducts}) {
  return (
    <>
      <Header />
      <Center>
        <Title>All products</Title>
        <ProductsGrid products={products} wishedProducts={wishedProducts}/>
      </Center>
    </>
  );
}

export async function getServerSideProps(ctx){
  await mongooseConnect();
  const products = await Product.find({}, null, {sort:{'_id':-1}});
  
  const {user} = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProducts = await WishedProduct.find({
    userEmail: user.email, 
    product: products.map(p => p._id.toString()),
    });

  return {
    props:{
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProducts.map(i => i.product.toString()),
    }
  }
}
