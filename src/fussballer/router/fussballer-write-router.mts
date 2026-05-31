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
