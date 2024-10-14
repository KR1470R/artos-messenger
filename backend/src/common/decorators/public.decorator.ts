import { IS_PUBLIC_KEY } from '#common/constants';
import { SetMetadata } from '@nestjs/common';

/**
 * Marks a method to be accessible without authorization.
 */
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export default Public;
