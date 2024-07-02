const {z}=require('zod');

const signupBody=z.object({
    username:z.string().email(),
    password:z.string().min(3),
    firstname:z.string(),
    lastname:z.string(),
})

const signinBody=z.object({
    username:z.string().email(),
    password:z.string().min(3),
})

const updateBody=z.object({
    firstname:z.string().optional(),
    lastname:z.string().optional(),
    password:z.string().optional(),
})

module.exports={
    signupBody: signupBody,
    signinBody:signinBody,
    updateBody: updateBody,
}