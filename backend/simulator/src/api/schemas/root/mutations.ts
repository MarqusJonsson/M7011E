import { GraphQLObjectType } from 'graphql';
import { setOverproductionBatteryToPowerPlantRatio, setUnderproductionBatteryToPowerPlantRatio } from '../house/mutations';
import { updateElectricityPrices } from '../powerPlant/mutations';
import { uploadProfilePicture } from '../picture/mutations';
import { deleteProsumer, setProsumerSellTimeout } from '../prosumer/mutations';

const rootMutation = new GraphQLObjectType({
	name: 'RootMutation',
	fields: {
		setOverproductionBatteryToPowerPlantRatio: setOverproductionBatteryToPowerPlantRatio,
		setUnderproductionBatteryToPowerPlantRatio: setUnderproductionBatteryToPowerPlantRatio,
		updateElectricityPrices: updateElectricityPrices,
		uploadProfilePicture: uploadProfilePicture,
		setProsumerSellTimeout: setProsumerSellTimeout,
		deleteProsumer: deleteProsumer
	}
});

export { rootMutation };
