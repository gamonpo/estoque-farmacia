'use strict'

const User = use('App/Models/User')

class UserController {

  async index () {
    const usuarios = await User.all()

    return usuarios
  }

  async show ({ params }) {
    const usuarios = await User.findOrFail(params.id)

    return usuarios
  }

  async store({ request }) {

    const { permissions, roles,...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles',
    ])
    
    const user = await User.create(data)

    if (roles) {
      await user.roles().attach(roles)
    }

    if (permissions) {
      await user.permissions().attach(permissions)
    }

    await user.loadMany(['roles', 'permissions'])

    return user
  }

  async update({ params, request}) {

    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])


    const user = await User.findOrFail(params.id)

    user.merge(data)

    await user.save()

    if (roles) {
      await user.roles().sync(roles)
    }

    if (permissions) {
      await user.permissions().sync(permissions)
    }

    await user.loadMany(['roles', 'permissions'])


    return user

  }

  async destroy({ params }) {
    const user = await User.findOrFail(params.id)

    await user.delete()
  }
}

module.exports = UserController
