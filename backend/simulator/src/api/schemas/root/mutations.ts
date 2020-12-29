import { GraphQLObjectType } from 'graphql';
import { setOverproductionRatio, setUnderproductionRatio } from '../house/mutations';
import { startProduction, stopProduction, updateElectricityPrices, updateProductionOutputRatio } from '../powerPlant/mutations';
import { uploadProfilePicture } from '../picture/mutations';
import { deleteProsumer, setProsumerSellTimeout } from '../prosumer/mutations';

const rootMutation = new GraphQLObjectType({
	name: 'RootMutation',
	fields: {
		setOverproductionRatio: setOverproductionRatio,
		setUnderproductionRatio: setUnderproductionRatio,
		updateElectricityPrices: updateElectricityPrices,
		uploadProfilePicture: uploadProfilePicture,
		setProsumerSellTimeout: setProsumerSellTimeout,
		deleteProsumer: deleteProsumer,
		updateProductionOutputRatio: updateProductionOutputRatio,
		startPowerPlantProduction: startProduction,
		stopPowerPlantProduction: stopProduction
	}
});

export { rootMutation };
