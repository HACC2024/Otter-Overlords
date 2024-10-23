import axios from 'axios'
import { getList } from '../utils/getList.js';
import { error } from 'console';
import { simplifyList } from '../utils/simplifyList.js';

const API_URL = 'https://opendata.hawaii.gov';

export const getFilteredDataset = async (organization, groups, tags, formats, licenses) => {
    try {
        let filters = [];

        if (organization) {
            filters.push(`organization:"${organization}"`);
        }
        if (groups && groups.length > 0) {
            const GROUPS_QUERY = groups.map(group => `groups:"${group}"`).join('+AND+');
            filters.push(GROUPS_QUERY);
        }
        if (tags && tags.length > 0) {
            const TAGS_QUERY = tags.map(tag => `tags:"${tag}"`).join('+AND+');
            filters.push(TAGS_QUERY);
        }
        if (formats && formats.length > 0) {
            const FORMATS_QUERY = formats.map(format => `res_format:"${format}"`).join('+AND+');
            filters.push(FORMATS_QUERY);
        }
        if (licenses && licenses.length > 0) {
            const LICENSES_QUERY = licenses.map(license => `license_id:"${license}"`).join('+AND+');
            filters.push(LICENSES_QUERY);
        }

        let fqQuery = filters.length > 0 ? filters.join('+AND+') : '';
        const apiUrl = fqQuery
            ? `${API_URL}/api/3/action/package_search?fq=${fqQuery}&rows=999`
            : `${API_URL}/api/3/action/package_search?rows=999`;

        const [FIRST_RESPONSE, SECOND_RESPONSE] = await Promise.all([
            axios.get(apiUrl),
            axios.get(apiUrl + '&start=1000')
        ]);

        const DATA = [...FIRST_RESPONSE.data.result.results, ...SECOND_RESPONSE.data.result.results];
        const SUCCESS = FIRST_RESPONSE.data.success && SECOND_RESPONSE.data.success;
        
        if (SUCCESS) {
            const simplifiedData = simplifyList(DATA); // Simplify the dataset
            return {
                count: FIRST_RESPONSE.data.result.count,
                results: simplifiedData, // Return the simplified data
                filters: getList(DATA, API_URL)
            };
        } else {
            throw new Error('Failed to fetch filtered dataset from Hawaii Open Data');
        }
    } catch (error) {
        throw new Error('Error fetching filtered dataset from Hawaii Open Data: ' + error.message);
    }
};

export const getFilters = async () => {
    try {
        const [FIRST_RESPONSE, SECOND_RESPONSE] = await Promise.all([
            axios.get(`${API_URL}/api/3/action/package_search?rows=999`),
            axios.get(`${API_URL}/api/3/action/package_search?rows=999&start=1000`)
        ]);

        const DATA = [...FIRST_RESPONSE.data.result.results, ...SECOND_RESPONSE.data.result.results];
        const SUCCESS = FIRST_RESPONSE.data.success && SECOND_RESPONSE.data.success;

        if (SUCCESS) {
            return getList(DATA, API_URL);
        } else {
            throw new Error('Failed to fetch dataset list from Hawaii Open Data' + error.message);
        }
    } catch (error) {
        throw new Error('Error fetching dataset list from Hawaii Open Data: ' + error.message);
    }
};
