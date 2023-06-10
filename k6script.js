import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    stages: [
      { duration: '30s', target: 100 },
      { duration: '1m30s', target: 150 },
      { duration: '20s', target: 200 }
    ],
  };

export default function () {
    const res = http.get('http://ec2-3-38-150-28.ap-northeast-2.compute.amazonaws.com/api/v1/');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
