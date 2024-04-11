import { useModel } from "@labmai-model";
import { Button } from "antd";

export default function index() {
    const { a } = useModel('global')
    const { initialState, refresh, loading } = useModel("@@initialState")
    console.log(a, initialState);

    return <Button loading={loading} onClick={() => {
        refresh()
    }}>
        点击刷新
    </Button>;
}
