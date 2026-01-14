export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface UserCore {
  username: string;
  email: string;
  createdAt: string;
}

export interface UserProfileData {
  user?: UserCore;
  following?: number;
  follower?: number;
  totalTrades?: number;
  portfolio: { investedAmount: number };
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
}
export interface QuestionStats {
  totalVolume: number;
}

export interface QuestionItem {
  id: string;
  question: string;
  options: OptionItem[];
  stats?: QuestionStats;
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

export interface CommentInterface {
  id: number;
  content: string;
  updatedAt: string;
  User?: UserPost;
}
