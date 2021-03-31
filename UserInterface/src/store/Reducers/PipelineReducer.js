import { PIPELINENAMES } from '../Types/ActionTypes'


const InitialState = {
    pipelinenames: null,
}


const PipelineDetails = (state = InitialState, action) => {
    switch (action.type) {
        case PIPELINENAMES:
            return ({ ...state, pipelinenames: action.pipelinenames })
        default:
            return state;
    }
}

export default PipelineDetails;