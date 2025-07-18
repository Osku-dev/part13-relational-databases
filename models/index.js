const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')
const Session = require('./session')

User.hasMany(Blog)
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsTo(User)
Blog.belongsToMany(User, { through: ReadingList, as: 'readers' })
User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Blog, User, ReadingList,  Session
}