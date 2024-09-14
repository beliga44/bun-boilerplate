import Elysia from "elysia";
import TodoModule from "./todo/todo.module";
import {ResponseDto} from "../commons/dto/response.dto";

export default new Elysia()
    .onAfterHandle((response) => {
        return JSON.parse(JSON.stringify(new ResponseDto(response)));
    })
    .onError( ({  error, request, set, code }) => {
        if (code === 'VALIDATION') {
            set.status = 400;
            const errors = error.all.map(x => {
                return {
                    property: x.path.replace('/', ''),
                    error: x.message,
                }
            });
            return {
                message: errors,
                status: 400
            };
        }

        return {
            message: error.message,
            status: set?.status || 500
        };
    })
    .use(TodoModule);