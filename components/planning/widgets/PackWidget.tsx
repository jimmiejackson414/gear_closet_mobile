import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FormSelect from '@/components/common/FormSelect';
import PackChart from '@/components/common/PackChart';
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Large, Text } from '@/components/ui';
import generateThemeOptions, { type Option, findTheme } from '@/helpers/chartTheme';
import { BackpackIcon, EllipsisVerticalIcon } from '@/lib/icons';
import { usePacks } from '@/services/packs';
import type { FormSelectOption } from '@/components/common/FormSelect';
import type { ExtendedPack } from '@/types/helpers';

const CustomIndicator: React.FC<{ option: Option }> = ({ option }) => (
  <View style={{
    flexDirection: 'row', alignItems: 'center', gap: 3,
  }}>
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 1,
    }}>
      {option.colors.map(color => (
        <View
          key={color}
          style={{
            height: 8, width: 8, borderRadius: 3, backgroundColor: color,
          }} />
      ))}
    </View>
  </View>
);

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

  const defaultPack = data?.id ? { label: data.name || 'Unnamed Pack', value: String(data.id) } : undefined;
  const [newPack, setNewPack] = useState<FormSelectOption | undefined>(defaultPack);
  const { data: packs, isLoading } = usePacks(isChangePackModalVisible);

  const handleChangePack = () => {
    console.log('Change Pack');
  };

  const packThemes = generateThemeOptions();
  const defaultTheme = data?.theme ? {
    label: data.theme, value: data.theme, colors: findTheme(data.theme),
  } : undefined;
  const [newTheme, setNewTheme] = useState<FormSelectOption | undefined>(defaultTheme);
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
            <DialogDescription>
              {`This will assign the ${data?.name || 'Unnamed pack'} to your current trip.`}
            </DialogDescription>
          </DialogHeader>
          <View>
            <FormSelect
              disabled={isLoading}
              name="user-packs"
              onChange={setNewPack}
              options={packs?.map(pack => ({ label: pack.name || 'Unnamed pack', value: String(pack.id) })) || []}
              placeholder="Available packs"
              value={newPack} />
          </View>
          <DialogFooter className="flex-row justify-between items-center">
            <Button
              onPress={() => setIsChangePackModalVisible(false)}
              variant="outline">
              Cancel
            </Button>
            <Button
              onPress={handleChangePack}
              variant="default">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Update Pack Theme Modal */}
      <Dialog
        onOpenChange={setIsUpdateThemeModalVisible}
        open={isUpdateThemeModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Pack Theme</DialogTitle>
            <DialogDescription>This will update the theme colors for your pack.</DialogDescription>
          </DialogHeader>
          <View>
            {/* TODO: Figure out why default value isn't being set */}
            <FormSelect
              customIndicator={option => <CustomIndicator option={option as Option} />}
              name="pack-themes"
              onChange={setNewTheme}
              options={packThemes}
              placeholder="Available pack themes"
              value={newTheme} />
          </View>
          <DialogFooter className="flex-row justify-between items-center">
            <Button
              onPress={() => setIsUpdateThemeModalVisible(false)}
              variant="outline">
              Cancel
            </Button>
            <Button onPress={handleUpdateTheme}>
              Change Theme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default PackWidget;