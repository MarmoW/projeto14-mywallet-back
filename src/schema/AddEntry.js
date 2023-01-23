import Joi from 'joi'

export const entrySchema = Joi.object({
    value: Joi.number().required(),
    description: Joi.string().required()
})