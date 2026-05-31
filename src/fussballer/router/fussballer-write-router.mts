import {
    type FussballerCreate,
    type FussballerUpdate,
} from '../service/fussballer-write-service.mts';
import {
    FussballerNeuSchema,
    type FussballerNeuType,
    FussballerUpdateSchema,
    type FussballerUpdateType,
} from './fussballer-validation.mts';
import {
    createProblemDetails,
    preconditionRequired,
} from '../../problem-details.mts';
import { Hono } from 'hono';
import { container } from '../../container.mts';
import { createBaseUrl } from './create-base-url.mts';
import { getLogger } from '../../logger/logger.mts';
import { rolesRequired } from '../../security/roles-required.mts';

const { fussballerWriteService } = container;

export const router = new Hono();

const logger = getLogger('fussballer-write-router', 'file');

//Neu anlegen
const fussballerDtoToFussballerCreateInput = (
    fussballerDTO: FussballerNeuType,
): FussballerCreate => {
    const auszeichnungen = fussballerDTO.auszeichnungen?.map(
        (auszeichnungDTO) => {
            return {
                bezeichnung: auszeichnungDTO.bezeichnung,
                saison: auszeichnungDTO.saison,
            };
        },
    );

    
