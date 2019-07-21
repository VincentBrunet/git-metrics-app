import axios from "axios";

var url = "http://127.0.0.1:7080/";

var $this = {};

$this.get = async function (route, params) {
    return await axios.get(url + route, {
        params: params,
    });
};

export default $this;
