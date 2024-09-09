const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadFile = require("../utils/uploadFile");
const Team = require("../model/Team");
const Company = require("../model/Company");
const Product = require("../model/Product");
const CartItem = require("../model/CartItem");
const upload = multer();

// Create a product for a company
// const cc_value = 20;
// const percentage = {
//   "PC" : 5,
//   "Supervisor" : 30,
//   "AM" : 38,
//   "Manager" : 45

// }

// const ranks = {
//   2 : "PC",
//   25 : "Supervisor",
//   75 : "AM",
//   120 : "Manager"
// }

router.post("/addProduct", upload.any(), async (req, res) => {
  const { name, description, points, type, price, id } = req.body;
  console.log("id ", id);
  const image = await uploadFile(req.files?.[0]);

  let owner;

  if (type === "team") {
    // add product to team in products
    owner = await Team.findById(id);

    if (!owner) {
      return res.status(400).json({ msg: "Team not found" });
    }

    // if team has parent company
    if (owner.companyId) {
      return res.status(400).json({
        msg: "Your team has a parent company, can't add products of your own, ask your company owner",
      });
    }
  }

  if (type === "company") {
    owner = await Company.findById(id);

    if (!owner) {
      return res.status(400).json({ msg: "Company not found" });
    }
  }

  const product = new Product({
    name,
    description,
    points,
    image,
    price,
    owner: owner._id,
  });

  await product.save();

  res.status(200).json({ msg: "Product added to your inventory" });
});

router.get("/getProducts/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)

  const products = await Product.find({ owner: id });

  res.status(200).json({ products });
});

const getImageUrl = async (prevUrl, file) => {
  if (prevUrl) {
    return prevUrl;
  }

  return await uploadFile(file);
};

router.post("/updateProduct", upload.any(), async (req, res) => {
  try {
    const { name, description, points, price, id, image } = req.body;

    const url = await getImageUrl(image, req.files?.[0]);

    // find product with owner = id, and update it
    await Product.findOneAndUpdate(
      { _id: id },
      {
        name,
        description,
        points,
        price,
        image: url,
      }
    );
    res.status(200).json({ msg: "Product details updated successfully!" });
  } catch (err) {
    res.status(400).json({ msg: "Error updating product details" });
  }
});

router.delete("/deleteProduct", async (req, res) => {
  try {
    const { id } = req.query;

    // find product with owner = id, and delete it
    await Product.findOneAndDelete({ _id: id });

    // delete cartItem where productId = id

    await CartItem.deleteMany({ productId: id });

    res.status(200).json({ msg: "Product deleted successfully!" });
  } catch (err) {
    res.status(400).json({ msg: "Error deleting product" });
  }
});

// Read all products for a company
// router.get('/companies/:companyId/products', async (req, res) => {
//   try {
//     const { companyId } = req.params;
//     const company = await Company.findById(companyId);

//     if (!company) {
//       return res.status(404).json({ error: 'Company not found' });
//     }
//     const products = company.products;
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// Update a product for a company
// router.put('/companies/:companyId/products/:productId', async (req, res) => {
//   try {
//     const { companyId, productId } = req.params;
//     const company = await Company.findById(companyId);

//     if (!company) {
//       return res.status(404).json({ error: 'Company not found' });
//     }
//     const { prodName, cc, p_img, category } = req.body;
//     const updatedProduct = {
//       prodName,
//       cc,
//       p_img,
//       category
//     };
//     const productIndex = company.products.findIndex(product => product._id.toString() === productId);
//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     company.products[productIndex] = updatedProduct;
//     const savedCompany = await company.save();
//     res.json(savedCompany);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// router.post('/update', async(req,res)=>{
//   const {product_id, cc, category, name} = req.body;
//   const prod =  await product.findById(product_id).exec();

//   if (cc)
//     prod.cc = cc;
//   if (category)
//     prod.category = category;
//   if (name)
//     prod.prodName = name;

//   const updatedProduct = new product(prod)
//    const saved = await updatedProduct.save();

//   res.status(200).json({"Updated" : saved});
// })

// router.post('/delete', async(req,res)=>{
//   const {product_id} = req.body;
//   const de = await product.findByIdAndDelete(product_id);
//   if (de){
//     res.status(200).json({"Delete" : "Successful"});
//   }

// })

// Delete a product for a company
// router.delete('/companies/:companyId/products/:productId', async (req, res) => {
//   try {
//     const { companyId, productId } = req.params;
//     const company = await Company.findById(companyId);
//     if (!company) {
//       return res.status(404).json({ error: 'Company not found' });
//     }
//     const productIndex = company.products.findIndex(product => product._id.toString() === productId);
//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     company.products.splice(productIndex, 1);
//     const savedCompany = await company.save();

//     res.json(savedCompany);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// router.post('/buy', async(req,res)=>{
//   const {user_id, product_id} = req.body;
//   const prod_obj = await product.findOne({_id : product_id})
//   const user_obj = await user.findOne({_id : user_id});
//   const cc = prod_obj.cc;
//   user_obj.personal_cc += cc;
//   let price = cc * cc_value;
//   if (user_obj.personal_cc >= 1){
//     if (user_obj.pc_cc + user_obj.personal_cc + user_obj.non_material_cc > 4){
//       if (user_obj.rank in percentage){
//         price = price * (percentage[user_obj.rank]/100);
//       }
//     }
//   }

//   const team_id = user_obj.team
//   const team_obj = await team.findOne({id : team_id});

//   const total_cc  = user_obj.personal_cc + user_obj.non_material_cc + user_obj.pc_cc
//   if (total_cc >= 120){
//     user_obj.rank = 'Manager'
//   }
//   else if (total_cc >= 75){
//     user_obj.rank = 'AM';
//   }
//   else if (total_cc >= 25){
//     user_obj.rank = 'Supervisor'
//   }
//   else if (total_cc >= 5){
//     user_obj.rank = 'PC';
//   }

//   const newUser = user(user_obj)
//   newUser.save()
//   res.status(200).json({"user_cc" : newUser})

// for (let index = 0; index < team_obj.member.length; index++) {
//   const element = team_obj.member[index];
//   const member = user.findOne({_id : element})

// }

// })

// const addProduct = async(company_id, product)=>{
//   const data = await Company.findOne({_id: company_id}).exec()
//   console.log(data)
//   data.products.push(product)

//   // await Company.deleteOne({CompName: companyName})
//   const newData = new Company(data)
//   newData.save()
//   console.log(newData)
// }

module.exports = router;
