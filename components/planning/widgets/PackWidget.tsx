import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PackChart from '@/components/common/PackChart';
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Large, Text } from '@/components/ui';
// import { useAppTheme } from '@/context/ThemeProvider';
import { makeStyles } from '@/helpers';
import { BackpackIcon, EllipsisVerticalIcon } from '@/lib/icons';
import type { ExtendedPack } from '@/types/helpers';

interface Props {
  data?: ExtendedPack;
}

const PackWidget: React.FC<Props> = ({ data }) => {
  const [isChangePackModalVisible, setIsChangePackModalVisible] = useState(false);
  const [isUpdateThemeModalVisible, setIsUpdateThemeModalVisible] = useState(false);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const handleChangePack = () => {
    console.log('Change Pack');
  };

  const handleUpdateTheme = () => {
    console.log('Update Theme');
  };

  return (
    <View>
      <Card className="w-full">
        <CardHeader className="flex-row items-center justify-between gap-6">
          <View className="flex-row items-center gap-6">
            <BackpackIcon className="stroke-primary" />
            <View style={{
              flexDirection: 'row',
              gap: 16,
              alignItems: 'center',
            }}>
              <CardTitle className="font-bold">Pack:</CardTitle>
              <Large>
                {data?.name || 'Unnamed Pack'}
              </Large>
            </View>
          </View>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <EllipsisVerticalIcon className="stroke-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent insets={contentInsets}>
              <DropdownMenuGroup>
                <DropdownMenuItem onPress={() => setIsChangePackModalVisible(true)}>
                  <Text>
                    Change Pack
                  </Text>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onPress={() => setIsUpdateThemeModalVisible(true)}>
                  <Text>
                    Update Theme Colors
                  </Text>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <PackChart pack={data} />
        </CardContent>
      </Card>

      {/* Change Pack Modal */}
      <Dialog
        onOpenChange={setIsChangePackModalVisible}
        open={isChangePackModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Pack</DialogTitle>
          </DialogHeader>
          <Text>Change Pack Modal.  Click outside this area to dismiss.</Text>
          <Button onPress={handleChangePack}>
            Change Pack
          </Button>
        </DialogContent>
      </Dialog>

      {/* Update Pack Theme Modal */}
      <Dialog
        onOpenChange={setIsUpdateThemeModalVisible}
        open={isUpdateThemeModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Pack Theme</DialogTitle>
          </DialogHeader>
          <Text>Change Pack Theme Modal.  Click outside this area to dismiss.</Text>
          <Button onPress={handleChangePack}>
            Change Theme Colors
          </Button>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default PackWidget;