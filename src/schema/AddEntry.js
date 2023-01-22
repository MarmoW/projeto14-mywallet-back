import joi from 'joi'

export const entrySchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required()
})