import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabPanelProps } from "@/utils/typesInterface";
import { userPositions } from "../service/apiService/user";
import moment from "moment";

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// @/utils/typesInterface.ts

export interface PositionOption {
  optionId: number;
  name: string;
  index: number;
  shares: number;
  currentPrice: number;
  positionValue: number;
}

export interface Position {
  marketId: number;
  question: string;
  questionType: string;
  status: string;
  endDate: string;
  option: PositionOption;
  allOptions: Array<{
    id: number;
    name: string;
    price: number;
    quantity: string;
  }>;
}

export interface PortfolioData {
  investedAmount?: number;
  currentValue?: number;
  totalPnL?: number;
}

export interface StatsData {
  activeMarkets?: number;
  totalTrades?: string | number;
}

export interface ProfileTabsProps {
  data: {
    portfolio?: PortfolioData;
    stats?: StatsData;
  };
}

export default function ProfileTabs({ data }: ProfileTabsProps) {
  const [value, setValue] = React.useState(0);
  const [positions, setPositions] = React.useState<Position[]>([]);

  const fetchPositions = async () => {
    try {
      const response = await userPositions();

      console.log(response, "response");

      if (response.success) {
        setPositions(response.data);
      } else {
        setPositions([]);
      }
    } catch {
      setPositions([]);
    }
  };
  React.useEffect(() => {
    fetchPositions();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "#495964" }}>
        <Tabs
          value={value}
          onChange={(_, v) => setValue(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              color: "#838383",
              textTransform: "none",
              fontSize: { xs: "12px", sm: "14px" },
              minWidth: "auto",
              px: 2,
            },
            "& .Mui-selected": {
              color: "#0099ff",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#0099ff",
            },
          }}
        >
          <Tab label="Positions" {...a11yProps(0)} />
          <Tab label="Portfolio" {...a11yProps(1)} />

          <Tab label="Posts" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        {false ? (
          <div className="text-center text-gray-400 py-8">
            Loading positions...
          </div>
        ) : positions && positions?.length > 0 ? (
          <div className="space-y-2">
            {positions?.length > 0 ? (
              positions?.map((position, i) => {
                const myOption = position.option;
                const currentValue = myOption.positionValue;

                return (
                  <div
                    key={i}
                    className="bg-[#0f172a] border border-gray-800 rounded-xl p-5 
                 hover:border-gray-700 transition-all duration-200"
                  >
                    <div className="flex relative flex-col sm:flex-row sm:justify-between sm:items-start gap-5">
                      {/* Left: Details */}
                      <div className="flex-1 space-y-1">
                        {/* Question */}
                        <div className="text-white font-medium text-base leading-snug pr-4">
                          {position.question}
                        </div>

                        {/* Info Rows */}
                        <div className="space-y-1 flex relative  text-sm">
                          {/* Your Option - Normal Text (No Badge) */}
                          <div>
                            <div className="flex items-start  gap-2">
                              <span className="text-gray-500 w-14">Option</span>{" "}
                              :
                              <span className="text-white font-semibold  flex-1 break-words">
                                {myOption.name}
                              </span>
                            </div>

                            <div className="flex items-center  gap-2">
                              <span className="text-gray-500  w-14">Price</span>{" "}
                              :
                              <span className="text-white font-semibold">
                                $ {(myOption.currentPrice || 0).toFixed(2)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 ">
                              <span className="text-gray-500  w-14">
                                Shares
                              </span>
                              :
                              <span className="text-gray-500 font-semibold">
                                {Number(myOption.shares || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col  items-end">
                        <p className="text-xs text-gray-500">Position</p>
                        <p className="text-3xl font-bold text-green-400">
                          {currentValue.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex  items-center gap-2 -right-1.5 -bottom-3 absolute">
                        <span className="text-gray-500">Resolves</span> :
                        <span className="text-gray-400">
                          {moment(position?.endDate).format("DD MMM YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No active positions yet</p>
                <p className="text-gray-600 text-sm mt-2">
                  Start trading to see your positions here
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No active positions yet.
          </div>
        )}
      </CustomTabPanel>

      {/* Portfolio */}

      {/* Top Categories */}
      <CustomTabPanel value={value} index={1}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-gray-800 pb-3">
          {[
            [
              "Invested",
              `$ ${Number(data?.portfolio?.investedAmount || 0).toFixed(2)}`,
              "text-white",
            ],
            [
              "Current Value",
              `$ ${Number(data?.portfolio?.currentValue || 0).toFixed(2)}`,
              "text-green-400",
            ],
            [
              "P/L",
              `$ ${Number(data?.portfolio?.totalPnL || 0).toFixed(2)}`,
              Number(data?.portfolio?.totalPnL) >= 0
                ? "text-green-400"
                : "text-red-400",
            ],
            [
              "Active Bets",
              Number(data?.stats?.activeMarkets || 0),
              "text-white",
            ],
          ].map(([label, val, color], i) => (
            <div key={i} className="bg-[#0f172a] p-3 rounded-lg">
              <p className="text-xs text-gray-400">{label}</p>
              <p className={`text-lg font-semibold ${color}`}>{val}</p>
            </div>
          ))}
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-5">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
            Create Your Own Prediction Market
          </h3>
          <p className="text-sm text-gray-400">
            Turn real-world events into tradable markets. Define outcomes and
            let the community decide.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {["Create Markets", "Earn Fees", "Community Driven"].map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-[#0099ff]/10 text-[#0099ff]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </CustomTabPanel>
    </Box>
  );
}
