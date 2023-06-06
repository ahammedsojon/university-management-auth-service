import { Request, Response } from 'express'
import usersService from './users.service'

const getUsers = async (req: Request, res: Response) => {
  res.status(200).json({
    msg: 'Welcome to uinversity!',
  })
}

const createUser = async (req: Request, res: Response) => {
  const { user } = req.body
  try {
    const result = await usersService.createUserToDB(user)
    res.status(200).json({
      success: true,
      message: 'User has been created successfully!',
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create user!',
    })
  }
}

export default {
  getUsers,
  createUser,
}
