// const mongoose = require('mongoose')
const User = require('./schemas/user')
const News = require('./schemas/news')
const helper = require('../helpers/serialize')

module.exports.getUserByName = async (userName) => {
  return User.findOne({ userName })
}
module.exports.getUserById = async (id) => {
  return User.findById({ _id: id })
}
module.exports.getUsers = async () => {
  return User.find()
}

module.exports.createUser = async (data) => {
  const { username, surName, firstName, middleName, password } = data
  const newUser = new User({
    userName: username,
    surName,
    firstName,
    middleName,
    image:
      'https://icons-for-free.com/iconfiles/png/512/profile+user+icon-1320166082804563970.png',
    permission: {
      chat: { C: true, R: true, U: true, D: true },
      news: { C: true, R: true, U: true, D: true },
      settings: { C: true, R: true, U: true, D: true },
    },
  })
  newUser.setPassword(password)
  const user = await newUser.save()
  console.log(user)
  return user
}

module.exports.updateUserPermission = async (id, data) => {
  return await User.findByIdAndUpdate(
    { _id: id },
    { $set: data },
    { new: true },
  )
}
module.exports.deleteUser = async (id) => {
  return User.findByIdAndRemove({ _id: id })
}

module.exports.updateUserProfile = async (id, data) => {
  return await User.findByIdAndUpdate(
    { _id: id },
    { $set: data },
    { new: true },
  )
}

module.exports.getNews = async () => {
  const news = await News.find()
  return news.map((news) => helper.serializeNews(news))
}
module.exports.createNews = async (data, user) => {
  const { title, text } = data
  const news = new News({
    title,
    text,
    user,
  })
  return await news.save()
}
module.exports.updateNews = async (id, data) => {
  return await News.findByIdAndUpdate({ _id: id }, { $set: data })
}
module.exports.deleteNews = async (id) => {
  return News.findByIdAndRemove({ _id: id })
}
