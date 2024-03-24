export const createNewBlogDto=()=>{
    return   {
        name: "string",
        description: "string",
        websiteUrl: "https://2MZjvsQkpz3JI_Z-cVql4fftm4AdjS_PPsHMs0aB9.6b4A7UT31-KsZs2c0ZX_mdLK"
    }
}

export const createNewPostDto=(blogId:string)=>{
    return {
        title: 'test',
        blogId,
        content: 'test content',
        shortDescription: "test"
    }
}