
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {ImCross} from 'react-icons/im'
import { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { URL } from '../url'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

// const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
// CLOUDINARY_URL="cloudinary://331925151269546:xsrXoWo-B80zgeULXhxOUE8zYXc@dtilpfqrs"
const CLOUDINARY_URL="https://api.cloudinary.com/v1_1/dtilpfqrs/image/upload"
const CLOUDINARY_UPLOAD_PRESET = 'images_preset';

const CreatePost = () => {
   
    const [title,setTitle]=useState("")
    const [desc,setDesc]=useState("")
    const [file,setFile]=useState(null)
    const {user}=useContext(UserContext)
    const [cat,setCat]=useState("")
    const [cats,setCats]=useState([])

    const navigate=useNavigate()

    const deleteCategory=(i)=>{
       let updatedCats=[...cats]
       updatedCats.splice(i)
       setCats(updatedCats)
    }

    const addCategory=()=>{
        let updatedCats=[...cats]
        updatedCats.push(cat)
        setCat("")
        setCats(updatedCats)
    }

    const handleCreate=async (e)=>{
        e.preventDefault()
        const post={
          title,
          desc,
          username:user.username,
          userId:user._id,
          categories:cats
        }

        if(file){//if a fileobject is present
          const data=new FormData() //"return the object in key value pair"
          console.log("form data",data)
          const filename=Date.now()+file.name
          data.append("img",filename)
          data.append("file",file)
          data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          // console.log (data)
          post.photo=filename//create an property for the object 'post' above{photo:filename}
          console.log(data)
          //img upload
          try{
            // const imgUpload=await axios.post(URL+"/api/upload",data)
            const imgUpload = await axios.post(CLOUDINARY_URL, data);
            console.log("image upload",imgUpload.data)
           
            post.imgUrl = imgUpload.data.secure_url;
            console.log( "image url hai..", post.imgUrl)//sab thi chal rha hai yhan
            const res=await axios.post(URL+"/api/posts/create",post, {
              headers: {
                   'Content-Type': 'application/json',
                  // 'Content-Type': 'multipart/form-data' this gave error 500
              },
              withCredentials: true // Ensure credentials are not included
          })
            navigate("/posts/post/"+res.data._id)
          }
          catch(err){
            console.log(err)
          }
        }
        //post upload
        // console.log(post)
        /*---mistake
        try{
          const res=await axios.post(URL+"/api/posts/create",post, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: false // Ensure credentials are not included
        })
          console.log(res)
          navigate("/posts/post/"+res.data._id)
          console.log(res.data)
          post.imgUrl = res.data.secure_url;
          await axios.post(URL+"/api/posts/create",post)\}
          */
      
      
      }



  return (
    <div>
        <Navbar/>
        <div className='px-6 md:px-[200px] mt-8'>
        <h1 className='font-bold md:text-2xl text-xl '>Create a post</h1>
        <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
          <input onChange={(e)=>setTitle(e.target.value)} type="text" placeholder='Enter post title' className='px-4 py-2 outline-none'/>
          <input onChange={(e)=>{
            // console.log("me file hoon",e.target.files[0])
            setFile(e.target.files[0])}} type="file"  className='px-4'/>
          <div className='flex flex-col'>
            <div className='flex items-center space-x-4 md:space-x-8'>
                <input value={cat} onChange={(e)=>setCat(e.target.value)} className='px-4 py-2 outline-none' placeholder='Enter post category' type="text"/>
                <div onClick={addCategory} className='bg-black text-white px-4 py-2 font-semibold cursor-pointer'>Add</div>
            </div>

            {/* categories */}
            <div className='flex px-4 mt-3'>
            {cats?.map((c,i)=>(
                <div key={i} className='flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md'>
                <p>{c}</p>
                <p onClick={()=>deleteCategory(i)} className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'><ImCross/></p>
            </div>
            ))}
            
            
            </div>
          </div>
          <textarea onChange={(e)=>setDesc(e.target.value)} rows={15} cols={30} className='px-4 py-2 outline-none' placeholder='Enter post description'/>
          <button onClick={handleCreate} className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg'>Create</button>
        </form>

        </div>
        <Footer/>
    </div>
  )
}

export default CreatePost