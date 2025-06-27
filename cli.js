require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false
})

const print = async () => {
  try {
    await sequelize.authenticate()
    console.log('Executing (default): SELECT * FROM blogs')

    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT
    })

    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })

  } catch (error) {
    console.error('Unable to connect to the database:', error)
  } finally {
    await sequelize.close()
  }
}

print()
