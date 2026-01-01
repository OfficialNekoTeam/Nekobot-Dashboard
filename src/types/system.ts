/**
 * 系统相关类型
 */

/** CPU 信息 */
export interface CPUInfo {
  usage: number;
  cores: {
    logical: number;
    physical: number;
  };
  frequency?: {
    current: number;
    min: number;
    max: number;
  };
}

/** 内存信息 */
export interface MemoryInfo {
  total: number;
  total_gb: number;
  used: number;
  used_gb: number;
  available: number;
  available_gb: number;
  percent: number;
  swap?: {
    total: number;
    used: number;
    percent: number;
  };
}

/** 磁盘信息 */
export interface DiskInfo {
  total: number;
  total_gb: number;
  used: number;
  used_gb: number;
  free: number;
  free_gb: number;
  percent: number;
  io?: {
    read_bytes: number;
    write_bytes: number;
  };
}

/** 网络信息 */
export interface NetworkInfo {
  [interfaceName: string]: {
    bytes_sent: number;
    bytes_recv: number;
    packets_sent: number;
    packets_recv: number;
  };
}

/** 系统信息 */
export interface SystemInfo {
  cpu: CPUInfo;
  memory: MemoryInfo;
  disk: DiskInfo;
  network?: NetworkInfo;
  process?: {
    pid: number;
    name: string;
    cpu_percent: number;
    memory_percent: number;
  };
  timestamp: string;
}

/** Bot 版本信息 */
export interface BotVersion {
  version: string;
  build_time: string;
  git_commit: string;
  git_branch: string;
}
