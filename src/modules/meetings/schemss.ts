import {z} from 'zod';
export const meetingsCreateSchema=z.object({
    name: z.string().min(1, {message: 'Name is required'}),
    agentId:z.string().min(1, {message: 'Agent is required'}),
});

export const meetingsUpdateSchema=  meetingsCreateSchema.extend({
    id:z.string().min(1,{message: "Id is required"}),

})