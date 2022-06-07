const router = require('express').Router();
const { PrismaClient }=require('@prisma/client');
const { response } = require('express');
const {check,validationResult}=require('express-validator')

const prisma=new PrismaClient()

router.get('/users', async (req, res, next) => {
  
  try{

    const users = await prisma.user.findMany({
      include:{
        posts : {
        include: { 
          categories:true
        }
      }},
    })
    res.json(users);

  }catch(error){
    next(error)
  }

});

router.get('/users/:id', async (req, res, next) => {
  
  try{

    const {id}=req.params;

    const user = await prisma.user.findUnique({
      where:{
        id : id
      },
      include : {posts:true}
    })

    res.json(user);

  }catch(error)
  {

  }

});


router.post('/users',[

  check('name','Name must be valid length').isLength({min:10,max:15}),
  check('email','email must be valid').isEmail(),
] ,  async (req, res, next) => {

  const errors=validationResult(req);

  if(!errors.isEmpty())
  {
    res.json(errors.errors.map((item)=>item.msg));
  }

  try{

    const user =  await prisma.user.create({
      data: {
        name : req.body.name,
        email: req.body.email,
        posts: {
          create :{
            title:req.body.title,
            categoryIDs:req.body.cat_id,           
          }
        },
      },
    })

    res.json(user);

  }catch(error){
    next(error);
  }
});


router.delete('/users/:id', async (req, res, next) => {
 
  try{
    const {id}=req.params;

    const deleteProduct =await prisma.user.delete({
      where : {
        id : id
      }
    })

    res.json(deleteProduct);

  }catch(error)
  {
    next(error);
  }
});


router.patch('/users/:id', async (req, res, next) => {
  
  try{
    
    const {id} =req.params;
    const user = await prisma.user.update({
      where:{
        id:id
      },
      data:req.body,
      
    })

    res.json(user);

  }catch(error)
  {
    next(error)
  }

});


module.exports = router;
