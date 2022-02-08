// implement your server here
// require your posts router and connect it here
const express = require('express')
const { restart } = require('nodemon')
const Post = require('./posts/posts-model')

const server = express()

server.use(express.json())

server.get('/hello', (req, res) => {
    res.json({ message: 'hello' })
})

//GET all posts
server.get('/api/posts', (req, res) => {
    Post.find()
    .then(post => {
        res.json(post)
    })
    .catch(err => {
        res.status(500).json({ 
            message: "The posts information could not be retrieved" 
        })
    })
})

//GET posts by id
server.get('/api/posts/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" 
                })
            } else {
                res.json(post)
            }
        })
        .catch(err => {
            res.status(500).json({ 
                message: "The post information could not be retrieved" 
            })
        })
})

//POST creates a post using info inside request body and returns a new obj
server.post('/api/posts', (req, res) => {
    if(!req.body.title || req.body.contents) {
        res.status(400).json({ 
            message: "Please provide title and contents for the post" 
        });
    } else {
        Post.insert(req.body)
            .then(post => {
                res.status(201).json(post);
            })
            .catch(() => {
                res.status(500).json({ 
                    message: "There was an error while saving the post to the database" 
            });
            });
    }
});

//PUT updates post with specific id
server.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const updated = await Post.update(id, body)
        if (!updated) {
            res.status(404).json({
                 message: "The post with the specified ID does not exist"
             })
        } else if(!body.title || body.contents) {
            res.status(400).json({ 
                message: "Please provide title and contents for the post" 
            });
        } else {
            let newPost = await Post.update(id, body);
                  res.status(200).json(newPost);
        }
    } catch (err) {
        res.status(500).json({ 
            message: "The post information could not be modified"
        })
    }
 })

 //DELETE
 server.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params
    Post.remove(id)
       .then(deletePost => {
           if (!deletePost) {
               res.status(404).json({ 
                   message: "The post with the specified ID does not exist" 
            })
           } else {
               res.json(deletePost)
           }
       } )
       .catch(err => {
           res.status(500).json({ 
               message: "The post could not be removed"
             })
       })
})

//GET comments
server.get('/api/posts/:id/comments', (req, res) => {
    Post.findCommentById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                     message: "The post with the specified ID does not exist"
                })
            } else {
                res.json(post)
            }
        })
        .catch(err => {
            res.status(500).json({ 
                message: "The comments information could not be retrieved" 
            })
        })
})

module.exports = server