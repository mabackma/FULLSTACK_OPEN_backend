const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes))
  const favorite = blogs.find((blog) => blog.likes === maxLikes)
  const favoriteObject = {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
  return favoriteObject
}

const mostBlogs = (blogs) => {
  const elementCount = {}
  let maxCount = 0
  let mode = null

  // Loop through array of authors
  blogs.map((blog) => blog.author).forEach((element) => {
    if (elementCount[element]) {
      elementCount[element]++
    } else {
      elementCount[element] = 1
    }

    if (elementCount[element] > maxCount) {
      maxCount = elementCount[element]
      mode = element
    }
  })

  return {
    author: mode,
    blogs: maxCount,
  }
}

// This function uses Lodash
const mostLikes = (blogs) => {
  // Group blogs by author
  const groupedByAuthor = lodash.groupBy(blogs, 'author');

  // Calculate total likes for each author
  const authorLikes = lodash.map(groupedByAuthor, (authorBlogs, author) => {
    const likes = lodash.sumBy(authorBlogs, 'likes')
    return { author: author, likes: likes }
  })

  // Find the author with the most likes
  const authorWithMostLikes = lodash.maxBy(authorLikes, 'likes');

  return authorWithMostLikes
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
