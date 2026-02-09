export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface UserCore {
  username: string;
  email: string;
  createdAt: string;
  image_url?: string;
  description?: string;
  id: number;
}

export interface UserProfileData {
  user?: UserCore;
  following?: number;
  stats: {
    totalTrades: number;
    activeMarkets: number;
  };
  follower?: number;
  totalTrades?: string | number;
  portfolio: {
    investedAmount: number;
    currentValue: number;
    totalPnL: number;
  };
}

export interface UserBalanceData {
  balance: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface UserPosition {
  shares: number;
  invested: number;
  pnl: number;
}

export interface OptionItem {
  id: number;
  name: string;
  price: number;
  winningProbability: number;
  userPosition?: UserPosition;
  trading: {
    totalVolume: number;
  };
}

export interface QuestionStats {
  totalVolume: number;
}

export interface QuestionItem {
  id: string;
  question: string;
  endDate: string;
  options: OptionItem[];
  stats?: QuestionStats;
  isBookmark: boolean;
  metadata: any;
}

export interface QuestionItemSecond {
  id: string;
  question: string;
  options: OptionItem[];
  stats?: QuestionStats;
  user?: Record<number, UserPosition>;
}

export interface CategoryState {
  category?: {
    id?: number;
  };
}

export interface UserState {
  user?: {
    id?: string;
  };
}

export interface RootState {
  category?: CategoryState;
  user?: UserState;
}

// ================= RAW API TYPES =================
export interface RawDataPoint {
  price: number;
  timestamp: number;
}

export interface RawSeries {
  optionName: string;
  name: string;
  data: RawDataPoint[];
}

// ================= CHART TYPES =================
export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartSeries {
  name: string;
  data: ChartPoint[];
}

export interface GraphData {
  series: RawSeries[];
}

interface UserDetails {
  id: number;
  username: string | null;
  image_url: string | null;
}
export interface PostFeeBack {
  id: number;
  userId: number;
  metadata: string;
  status: boolean;
  questionId: number | null;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: number; // 0 | 1
  isBookmarked: number; // 0 | 1
  isUserLike: number; // 0 | 1
  User: UserDetails;
}

export type SetPosts = React.Dispatch<React.SetStateAction<PostFeeBack[]>>;

interface UserPost {
  id: number;
  username: string;
  image_url?: string | null;
}

export interface PostMetadata {
  content?: string;
  images?: string[];
}

export interface PostDetails {
  id: number;
  metadata: PostMetadata;
  updatedAt: string;
  commentCount: number;
  likeCount: number;
  isLiked: number;
  isBookmarked: number;
  User?: UserPost;
}

export interface IUser {
  id: number;
  username: string;
  image_url?: string;
}
export interface IReply {
  id: number;
  length: number;
  likeCount: number;
  isUserLike: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  metadata: string;
  User: IUser;
  isReply: boolean;
}
export interface IComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  User: IUser;
  replies: IReply[];
}
export interface CommentInterface {
  id: number;
  likeCount: number;
  isUserLike: number;
  content: string;
  updatedAt: string;
  commentCount: string;
  createdAt: string;
  User?: UserPost;
  replies: IReply[];
  isReply: boolean;
  metadata: any;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface UploadedImage {
  url: string;
}

export interface LeaderboardItem {
  userId: number;
  username: string;
  profit: number;
  invested: number;
  pnl: number;
  rank: number;
  roi: number;
}

export interface CancelOrders {
  maxCost: number;
  shares: number;
}

export interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  selectedOrderDetails?: CancelOrders | null;
}

type OrderSide = "BUY" | "SELL";
export interface SocketTradePayload {
  orderId: number;
  optionId: number;
  filledShares: number;
  share: number;
  cash: number;
  side: OrderSide;
  ts: number;

  type: string;
}

export interface SocketOrderUpdatePayload {
  questionId: string;
  optionId: number;
  orderId: number;
  filled: number;
  side: OrderSide;
  prices: number[];
  type: string;
}

export interface SocketPricePayload {
  questionId: string;
  prices: number[];
  ts?: number;
  options: [];
  timestamp: string;
}

export interface MarketData {
  question?: {
    question: string;
    metadata: string;
  };
  market?: {
    totalMarketVolume: number;
  };
  options?: OptionItem[];
  lastOrderUpdatedAt: string;
}

export interface OrderItem {
  id: number;
  optionId: number;
  minProceeds: number;
  shares: number;
  price: number;
  side: OrderSide;
  status: string;
  createdAt: string;
  tpslLeg: string;
  triggerPrice: number;
  maxCost: number;
}

export interface UpdateProfilePRops {
  isOpen: boolean;
  handleClose: () => void;
  userDetails: UserProfileData | null;
  fetchUserDetails: () => void;
}

export interface userDetailProps {
  username: string;
  email: string;
  image_url: string;
  description: string;
}

export interface headerRootState {
  category?: {
    category?: {
      id?: number;
    };
  };
  user?: {
    id?: number;
    isAuth: boolean;
    user: {
      id?: number;
    };
  };
}

export interface isWatchListInterface {
  category: { isWatchList: boolean; isFilterQuestion: boolean };
}

export interface userIdInterFace {
  user: {
    user: {
      id: string;
    };
  };
}

export interface SocketOption {
  optionId: number;
  price: number;
}

export interface UserDetailsRootState {
  user?: {
    user?: { id?: number };
  };
}

export interface SellOrder {
  saleAtPrice?: number | string;
}

export interface OrderFlowItem {
  id: number;
  optionId: number;
  shares: number;
  saleAtPrice: number;
  createdAt: string;
}

export interface OrderFlow {
  buys: OrderFlowItem[];
  sells: OrderFlowItem[];
}
