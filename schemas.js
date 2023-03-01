const Joi =require ('joi');

module.exports.uncSchema = Joi.object({
    roster: Joi.object({
        name: Joi.string().required(),
        title: Joi.string().required(),
        height: Joi.string().required(),
        class: Joi.string().required(),
        hometown: Joi.string().required(),
        weight: Joi.number().required(),
        image: Joi.string().required()
    }).required()
});

module.exports.takeSchema = Joi.object({
    take: Joi.object({
        body: Joi.string().required()
    }).required()

})
