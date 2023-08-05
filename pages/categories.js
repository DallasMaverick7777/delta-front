import { getServerSession } from "next-auth";
import Center from "../components/Center";
import Header from "../components/Header";
import ProductBox from "../components/ProductBox";
import Title from "../components/Title";
import { Category } from "../models/category";
import { Product } from "../models/product";
import Link from "next/link";
import styled from "styled-components";
import { authOptions } from "./api/auth/[...nextauth]";
import { mongooseConnect } from "../lib/mongoose";
import { WishedProduct } from "../models/WishedProduct";
import { RevealWrapper } from "next-reveal";

const CategoryGrid = styled.div`
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 20px;`;

const CategoryTitle = styled.div`
display: flex;
margin-top: 40px;
margin-bottom: 0;
align-items: center;
gap: 15px;
h2{margin-bottom: 10px; margin-top: 10px;}
a{color: #555; display: inline-block; text-decoration: none;}`;

const CategoryWrapper = styled.div`
margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
background-color: #fff;
height: 160px;
border-radius: 10px;
align-items: center;
display: flex;
justify-content: center;
color: #555;
text-decoration: none;
`;

export default function CategoriesPage({mainCategories, categoriesProducts, wishedProducts=[]}){
    return(
        <>
      <Header />
      <Center>
        {mainCategories.map(cat => (
          <CategoryWrapper>
            <CategoryTitle>
              <h2>{cat.name}</h2>
              <div>
                <Link href={'/category/'+cat._id}>Show all</Link>
              </div>
            </CategoryTitle>
            <CategoryGrid>
              {categoriesProducts[cat._id].map((p,index) => (
                <RevealWrapper delay={index*50}>
                  <ProductBox {...p} wished={wishedProducts.includes(p._id)} />
                </RevealWrapper>
              ))}
              <RevealWrapper delay={categoriesProducts[cat._id].length*50}>
                <ShowAllSquare href={'/category/'+cat._id}>
                  Show all &rarr;
                </ShowAllSquare>
              </RevealWrapper>
            </CategoryGrid>
          </CategoryWrapper>
        ))}
      </Center>
    </>
    )    
}

export async function getServerSideProps(ctx){
    await mongooseConnect();
    const categories = await Category.find();
    const mainCategories = categories.filter(c => !c.parent);
    const categoriesProducts = {};
    const allFetchedProductsId = [];
    for (const mainCat of mainCategories){
        const mainCatId = mainCat._id.toString();
        const childCatIds = categories
        .filter(c => c?.parent?.toString() === mainCatId)
        .map(c => c._id.toString());
        const categoriesIds = [mainCatId, ...childCatIds];
        const products = await Product.find({category:mainCat._id}, null, {limit:3,sort:{'_id':-1}});
        allFetchedProductsId.push(...products.map(p => p._id.toString()))
        categoriesProducts[mainCat._id] = products;
    }

    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const wishedProducts = session?.user
      ? await WishedProduct.find({
        userEmail:session?.user.email,
        product: allFetchedProductsId,
      })
      : [];

    return{
        props:{
            mainCategories: JSON.parse(JSON.stringify(mainCategories)),
            categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
            wishedProducts: wishedProducts.map(i => i.product.toString()),
        },
    };
}